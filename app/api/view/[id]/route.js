import { consumeSnippet } from '../../../../lib/store';

export async function GET(request, { params }) {
  const unwrappedParams = await params;
  const result = consumeSnippet(unwrappedParams.id);
  
  if (!result) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json(result);
}
