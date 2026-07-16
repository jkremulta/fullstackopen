import { useState } from "react";
import { TextField, Button } from "@mui/material";

const Form = ({ handleCreateBlog }) => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    url: "",
  });

  const createBlog = (event) => {
    event.preventDefault();
    handleCreateBlog(form);
    setForm({
      title: "",
      author: "",
      url: "",
    });
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          <TextField
            name="title"
            sx={{ width: "40ch" }}
            size="small"
            margin="dense"
            id="outline-required"
            label="title"
            value={form.title}
            onChange={(event) =>
              setForm({
                ...form,
                [event.target.name]: event.target.value,
              })
            }
          ></TextField>
        </div>
        <div>
          <TextField
            name="author"
            sx={{ width: "40ch" }}
            size="small"
            margin="dense"
            id="outline-required"
            label="author"
            value={form.author}
            onChange={(event) =>
              setForm({
                ...form,
                [event.target.name]: event.target.value,
              })
            }
          ></TextField>
        </div>
        <div>
          <TextField
            name="url"
            sx={{ width: "40ch" }}
            size="small"
            margin="dense"
            id="outline-required"
            label="url"
            value={form.url}
            onChange={(event) =>
              setForm({
                ...form,
                [event.target.name]: event.target.value,
              })
            }
          ></TextField>
        </div>
        <Button sx={{ mt: 2 }} variant="contained" type="submit">
          create
        </Button>
      </form>
    </div>
  );
};

export default Form;
