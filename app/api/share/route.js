import { createSnippet } from '../../../lib/store';

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const text = typeof body?.text === 'string' ? body.text : '';
  const maxViews = Number(body?.maxViews);

  if (!text.trim()) {
    return Response.json({ error: 'Text is required.' }, { status: 400 });
  }

  if (!Number.isInteger(maxViews) || maxViews < 1 || maxViews > 6) {
    return Response.json({ error: 'Allowed views must be from 1 to 6.' }, { status: 400 });
  }

  const id = createSnippet(text, maxViews);
  return Response.json({ id, path: `/s/${id}` }, { status: 201 });
}