export const getTweet = (url: string) =>
  fetch(
    `https://publish.twitter.com/oembed?url=${url}&omit_script=1&theme=dark`
  )
    .then((res) => res.json<{ html: string }>())
    .then(({ html }) => ({ url, html }));
