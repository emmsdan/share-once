const globalStore = globalThis;

if (!globalStore.__snippetStore) {
  globalStore.__snippetStore = new Map();
}

function createId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789-!_.:~';
  let id = '';
  for (let i = 0; i < 12; i += 1) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function generateUniqueId(store) {
  let id = createId();
  while (store.has(id)) {
    id = createId();
  }
  return id;
}

export function createSnippet(text, maxViews) {
  const id = generateUniqueId(globalStore.__snippetStore);
  globalStore.__snippetStore.set(id, {
    text,
    remainingViews: maxViews,
    createdAt: Date.now()
  });
  return id;
}

export function consumeSnippet(id) {
  const entry = globalStore.__snippetStore.get(id);
  if (!entry) {
    return null;
  }

  entry.remainingViews -= 1;
  const remainingAfterView = entry.remainingViews;

  if (remainingAfterView <= 0) {
    globalStore.__snippetStore.delete(id);
  } else {
    globalStore.__snippetStore.set(id, entry);
  }

  return {
    text: entry.text,
    remainingAfterView: Math.max(remainingAfterView, 0)
  };
}