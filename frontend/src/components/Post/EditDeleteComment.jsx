//Imports
import axios from "axios";
import React, { useEffect, useState } from "react";
const token = localStorage.getItem("token");
let userId = localStorage.getItem("userId");

const admin = localStorage.getItem("isAdmin");

const EditDeleteComment = ({ comment, users, getcomments }) => {
  const [isAuthor, setIsAuthor] = useState(false);
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState("");
  const handleEdit = (e) => {
    e.preventDefault();
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/comment/${comment.id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
      data: {
        content,
      },
    })
      .then((res) => {
        setContent("")
        getcomments();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const checkAuthor = () => {
      if (Number(userId) === comment.UserId || admin === "true") {
        setIsAuthor(true);
      }
    };
    checkAuthor();
  }, [comment.UserId]);

  const handleDelete = () => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}api/comment/${comment.id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        getcomments()
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="edit-comment">
      {isAuthor && edit === false && (
        <span onClick={() => setEdit(!edit)}>
          <img src="../../images/edit.svg" alt="edit" />
        </span>
      )}
      {isAuthor && edit && (
        <form action="" onSubmit={handleEdit} className="edit-comment-form  ">
        <label htmlFor="text" onClick={() => setEdit(!edit)}>
            Annuler
          </label>
          
          <br />
          <input
            className="comment-container"
            type="text"
            name="text"
            onChange={(e) => setContent(e.target.value)}
            defaultValue={comment.content}
          />
          <br />
          <div className="btn">
            <span
              onClick={() => {
                if (window.confirm("Voulez vous supprimer ce commentaire?")) {
                  handleDelete();
                }
              }}
            >
              <img src="../../images/trash.svg" alt="" />
            </span>
            <input type="submit" value="Valider modifications" />
          </div>
        </form>
      )}
    </div>
  );
};

export default EditDeleteComment;
