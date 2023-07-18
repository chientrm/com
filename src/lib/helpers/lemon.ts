import { LEMON_SQUEEZY_API_KEY } from '$env/static/private';

const api = 'https://api.lemonsqueezy.com/v1/',
  headers = {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    Authorization: `Bearer ${LEMON_SQUEEZY_API_KEY}`
  },
  productId = 93386,
  getTorrentVariants = () =>
    fetch(`${api}variants?filter[product_id]=${productId}`, { headers })
      .then((res) =>
        res.json<{
          data: {
            id: string;
            attributes: {
              product_id: number;
              name: string;
              slug: string;
              description: string;
              price: number;
            };
          }[];
        }>()
      )
      .then((obj) => obj.data)
      .then((data) => data.map(({ attributes }) => attributes))
      .then((variants) =>
        variants.map(({ product_id, name, slug, description, price }) => ({
          product_id,
          name,
          slug,
          description,
          price
        }))
      );
export { getTorrentVariants };
