import React, { Component } from "react";
import PropTypes from "prop-types";
import CommentItem from "./CommentItem";

class CommentFeed extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { comments, postId } = this.props;
    return comments.map((comment) => (
      <CommentItem key={comment._id} comment={comment} postId={postId} />
    ));

    // return (
    //   <>
    //     {posts.map((post) => {
    //       <PostItem key={post._id} post={post} />;
    //     })}
    //   </>
    // );
  }
}

CommentFeed.propTypes = {
  comments: PropTypes.array.isRequired,
  postId: PropTypes.string.isRequired,
};

export default CommentFeed;
