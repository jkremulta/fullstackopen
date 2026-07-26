import { useMutation, useQuery } from "@apollo/client/react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useState } from "react";

const Authors = (props) => {
  const { loading, data } = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  const submit = (event) => {
    event.preventDefault();

    editAuthor({ variables: { name, setBornTo: Number(born) } });
    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <div>
        <form onSubmit={submit}>
          <select
            value={name}
            onChange={(event) => setName(event.target.value)}
          >
            <option value="">--Please choose an option--</option>
            {data.allAuthors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
          <div>
            born
            <input
              type="number"
              onChange={(event) => setBorn(event.target.value)}
            />
          </div>
          <button type="submit">update author</button>
        </form>
      </div>
    </div>
  );
};

export default Authors;
