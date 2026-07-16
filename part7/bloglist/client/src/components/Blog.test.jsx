// Make a test, which checks that the component displaying
// a blog renders the blog's title and author, but does not render its URL
// or number of likes by default.

// Add CSS classes to the component to help the testing as necessary.

import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

const blog = {
  title: "Testing React",
  author: "Jane Doe",
  url: "https://example.com",
  likes: 5,
  user: { username: "Jane" },
};

test("Blog information and number of likes are displayed to unauthenticated users, buttons are not displayed", () => {
  render(<Blog blog={blog} />);

  const title = screen.getByText("Testing React: Jane Doe");
  expect(title).toBeVisible();

  const url = screen.getByText("https://example.com");
  expect(url).toBeVisible();

  const likes = screen.getByText("likes 5");
  expect(likes).toBeVisible();

  const button = screen.queryByRole("button", { name: "like" });
  expect(button).toBeNull();
});

test("Authenticated users who are not the creator of the blog are shown only the like button", () => {
  render(<Blog blog={blog} loggedUser={{ username: "Bob" }} />);

  const url = screen.getByText("https://example.com");
  expect(url).toBeVisible();

  const likeButton = screen.queryByRole("button", { name: "like" });
  expect(likeButton).toBeVisible();

  const removeButton = screen.queryByRole("button", { name: "remove" });
  expect(removeButton).toBeNull();
});

test("The creator of the blog is shown the delete button", async () => {
  render(<Blog blog={blog} loggedUser={{ username: "Jane" }} />);

  const removeButton = screen.queryByRole("button", { name: "remove" });
  expect(removeButton).toBeVisible();
});
