import React from "react";
import { useState } from "react";

interface CommentBoxProps {
  onSubmit: (comment: string) => void;
  onCancel: () => void;
}

export const CommentBox: React.FC<CommentBoxProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [comment, setComment] = useState<string>("");

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (comment.trim() !== "") {
      onSubmit(comment);
      setComment("");
    }
  };

  return (
    <div className="comment-box">
      <textarea
        placeholder="Enter your comment..."
        value={comment}
        onChange={handleCommentChange}
      ></textarea>
      <div className="comment-box-buttons">
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};
