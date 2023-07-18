export const getTweet = (url: string) =>
  fetch(`https://publish.twitter.com/oembed?url=${url}`)
    .then((res) => res.json<{ html: string }>())
    .then((data) => ({
      url,
      html: data.html.replace(
        '\u003Cscript async src="https://platform.twitter.com/widgets.js" charset="utf-8"\u003E\u003C/script\u003E\n',
        ''
      )
    }));
