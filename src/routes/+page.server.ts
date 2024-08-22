export function load({ url }) {
  const accountName = url.searchParams.get('accountName');
  return { accountName };
}
