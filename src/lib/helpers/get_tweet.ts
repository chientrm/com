export const getTweet = (colorMode: string) => {
  const theme = colorMode === 'white' ? 'white' : 'dark';
  return (url: string) =>
    fetch(
      `https://publish.twitter.com/oembed?url=${url}&omit_script=1&theme=${theme}`
    )
      .then((res) => res.json<{ html: string }>())
      .then(({ html }) => ({ url, html }));
};
