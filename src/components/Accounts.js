import {useState, useEffect, useContext} from "react";
import AuthContext from "./AuthContext";

export default function AccountsTemplate() {
  const auth = useContext(AuthContext);
  const {user, setUser} = auth;

  function uploadImage(e) {
    const files = e.target.files;

    const formData = new FormData();
    formData.append("image", files[0]);

    fetch(`${process.env.REACT_APP_HOSTNAME}/accounts/edit/image`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      body: formData
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then(data => {
      const editedUser = {...user, image: data};
      setUser(editedUser);
      alert("Image is uploaded");
    })
    .catch(error => {
      alert("Something's broken");
    })
  }

  function deleteImage() {
    fetch(`${process.env.REACT_APP_HOSTNAME}/accounts/edit/image`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      const editedUser = {...user, image: null};
      setUser(editedUser);
    })
    .catch(error => {
      alert("Something's broken")
    })
  }
  
  function editBio(bio, setBio) {
    const formData = {bio};

    fetch(`${process.env.REACT_APP_HOSTNAME}/accounts/edit`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then(data => {
      const editedUser = {...user, bio: data};
      
      setUser(editedUser);
      alert("account is updated")
      setBio("");
    })
    .catch(error => {
      alert("Something's broken")
      console.error(error)
    })
  }

  return (
    <div className="px-2">
      <Image
        user={user} 
        uploadImage={uploadImage} 
        deleteImage={deleteImage} 
      />
      <Form
        user={user} 
        editBio={editBio} 
      />
    </div>  
  )
}

function Image({user, uploadImage, deleteImage}) {
  return (
    <div className="mb-4">
      <img 
        src={`${process.env.REACT_APP_HOSTNAME}/users/${user.image || "avatar.jpeg"}`} 
        className="w-24 h-24 object-cover rounded-full"
      />
      {user.image ? (
        <button 
          type="button" 
          className="text-red-400"
          onClick={deleteImage}
          >
            Delete image
          </button>
      ) : (
        <input
          type="file"
          onChange={uploadImage}
        />
      )
      }
    </div>
  )
}

function Form({user, editBio}) {
  const [bio, setBio] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    editBio(bio, setBio);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label htmlFor="">Username</label>
        <input type="text" className="border px-2 py-1 w-full" value={user.username} disabled={true} />
      </div>
      <div className="mb-2">
        <label htmlFor="">Email</label>
        <input type="text" className="border px-2 py-1 w-full" value={user.email} disabled={true} />
      </div>
      <div className="mb-2">
        <label htmlFor="">Bio</label> 
        <textarea rows="3" className="border px-2 py-1 w-full" defaultValue={user.bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <div>
        <button type="submit" className="border border-black px-2 disabled:opacity-[0.2]" disabled={!bio.trim()}>Submit</button>
      </div>
    </form>
  )
}