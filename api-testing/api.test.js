import axios from "axios";

// Тест для GET (всі записи)
test('GET /posts returns a list of posts', async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
  expect(response.status).toBe(200);
  expect(Array.isArray(response.data)).toBe(true);
});

// Тест для GET (конкретний запис)
test('GET /posts/1 returns a specific post', async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
  expect(response.status).toBe(200);
  expect(response.data.id).toBe(1);
});

// Тест для POST (створення нового запису)
test('POST /posts creates a new post', async () => {
  const newPost = { title: 'foo', body: 'bar', userId: 1 };
  const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);
  expect(response.status).toBe(201);
  expect(response.data.title).toBe('foo');
});

// Тест для PUT (оновлення запису)
test('PUT /posts/1 updates a post', async () => {
  const updatedPost = { id: 1, title: 'updated title', body: 'updated body', userId: 1 };
  const response = await axios.put('https://jsonplaceholder.typicode.com/posts/1', updatedPost);
  expect(response.status).toBe(200);
  expect(response.data.title).toBe('updated title');
});

// Тест для DELETE (видалення запису)
test('DELETE /posts/1 deletes a post', async () => {
  const response = await axios.delete('https://jsonplaceholder.typicode.com/posts/1');
  expect(response.status).toBe(200);
});