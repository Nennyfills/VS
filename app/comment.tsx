import { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Send,
  Check,
  X,
  MessageCircle,
  User,
  Edit2,
} from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useVideoStore } from '@/stores/videoStore';
import { VideoComment } from '@/types/video';

const EDIT_TIME_LIMIT = 60 * 60 * 1000; // 1 hour in ms
const MAX_COMMENT_LENGTH = 500;

const canEditComment = (
  comment: VideoComment,
  isLatestComment: boolean
): boolean => {
  if (comment.author !== 'You') return false;
  if (!isLatestComment) return false;
  const createdAt =
    typeof comment.createdAt === 'string'
      ? new Date(comment.createdAt)
      : comment.createdAt;
  return Date.now() - createdAt.getTime() <= EDIT_TIME_LIMIT;
};

const formatCreatedAt = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((Date.now() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const CommentCard = ({
  comment,
  isEditing,
  editText,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTextChange,
  index,
  isLatestComment,
}: {
  comment: VideoComment;
  isEditing: boolean;
  editText: string;
  onStartEdit: (id: string, text: string, index: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  index: number;
  isLatestComment: boolean;
}) => {
  const canEdit = useMemo(
    () => canEditComment(comment, isLatestComment),
    [comment, isLatestComment]
  );
  const formattedTime = useMemo(
    () => formatCreatedAt(comment.createdAt),
    [comment.createdAt]
  );

  return (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <View style={styles.authorSection}>
          <View style={styles.avatar}>
            <User size={16} color="#ff6b6b" />
          </View>
          <View>
            <Text style={styles.authorName}>{comment.author}</Text>
            <Text style={styles.timestamp}>{formattedTime}</Text>
          </View>
        </View>
        {canEdit && !isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onStartEdit(comment.id, comment.text, index)}
            testID="edit-comment"
          >
            <Edit2 size={16} color="#ff6b6b" />
          </TouchableOpacity>
        )}
      </View>
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={onEditTextChange}
            multiline
            autoFocus
            maxLength={MAX_COMMENT_LENGTH}
          />
          <View style={styles.editFooter}>
            <Text style={styles.editCharacterCount}>
              {editText.length}/{MAX_COMMENT_LENGTH}
            </Text>
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onCancelEdit}
                testID="cancel-edit"
              >
                <X size={16} color="#ff6b6b" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={onSaveEdit}
                testID="save-edit"
              >
                <Check size={16} color="#22c55e" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.commentText}>{comment.text}</Text>
      )}
    </View>
  );
};

const CommentSection = () => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const { getCommentsForVideo, addComment, updateComment } = useVideoStore();

  const comments = useMemo(() => {
    const allComments = getCommentsForVideo(videoId);
    return [...allComments].reverse(); // Latest comments at top
  }, [getCommentsForVideo, videoId, refreshKey]);

  const handleAddComment = useCallback(() => {
    const trimmedComment = newComment.trim();
    if (trimmedComment) {
      addComment(videoId, trimmedComment, 'You');
      setNewComment('');
      setRefreshKey((prev) => prev + 1); // Force refresh

      // Scroll to top to show the new comment
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      }, 100);
    }
  }, [newComment, videoId, addComment]);

  const startEditing = useCallback(
    (commentId: string, text: string, index: number) => {
      setEditingComment(commentId);
      setEditText(text);
    },
    []
  );

  const saveEdit = useCallback(() => {
    const trimmedText = editText.trim();
    if (trimmedText && editingComment) {
      updateComment(editingComment, trimmedText);
      setEditingComment(null);
      setEditText('');
      setRefreshKey((prev) => prev + 1);
    }
  }, [editText, editingComment, updateComment]);

  const cancelEdit = useCallback(() => {
    setEditingComment(null);
    setEditText('');
  }, []);

  const isCommentValid = useMemo(
    () => newComment.trim().length > 0,
    [newComment]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.keyboardAvoid}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MessageCircle size={28} color="#ff6b6b" />
          <Text style={styles.headerTitle}>Comments</Text>
        </View>
        <Text style={styles.commentCount}>
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.commentsContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {comments.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color="#94a3b8" />
            <Text style={styles.emptyStateText}>No comments yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Be the first to share your thoughts!
            </Text>
          </View>
        ) : (
          comments.map((comment, index) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              index={index}
              isLatestComment={index === 0}
              isEditing={editingComment === comment.id}
              editText={editText}
              onStartEdit={startEditing}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
              onEditTextChange={setEditText}
            />
          ))
        )}
      </ScrollView>

      {!editingComment && (
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Add a comment..."
              placeholderTextColor="#a1a1aa"
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={MAX_COMMENT_LENGTH}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !isCommentValid && styles.sendButtonDisabled,
              ]}
              onPress={handleAddComment}
              disabled={!isCommentValid}
              testID="send-comment"
            >
              <Send size={20} color={isCommentValid ? '#fff' : '#94a3b8'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.characterCount}>
            {newComment.length}/{MAX_COMMENT_LENGTH}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    backgroundColor: '#18181b',
    flex: 1,
  },
  header: {
    backgroundColor: '#18181b',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#232329',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 12,
  },
  commentCount: {
    fontSize: 14,
    color: '#a1a1aa',
    fontWeight: '500',
    paddingTop: 8,
  },
  commentsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  commentCard: {
    backgroundColor: '#232329',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 2,
  },
  editButton: {
    padding: 4,
  },
  commentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
  },
  editContainer: {
    marginTop: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#1a1a1a',
    minHeight: 60,
    textAlignVertical: 'top',
    color: '#fff',
  },
  editFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  editCharacterCount: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
  saveButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f0fdf4',
  },
  inputContainer: {
    backgroundColor: '#18181b',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#232329',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#232329',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    maxHeight: 100,
    minHeight: 20,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    padding: 8,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#232329',
  },
  characterCount: {
    fontSize: 12,
    color: '#a1a1aa',
    textAlign: 'right',
  },
});

export default CommentSection;
