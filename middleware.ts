// middleware.ts
import { NextApiResponse, NextApiRequest } from 'next';
import { parseCookies } from 'nookies';

export const middleware = (handler) => async (req: NextApiRequest, res: NextApiResponse) => {
  // Parse cookies dari request
  const cookies = parseCookies({ req });
  const userToken = cookies.token;

  // Jika tidak ada token, kirim respons redirect ke halaman login
  if (!userToken) {
    res.writeHead(302, { Location: '/login' }).end();
    return;
  }

  // Jika token ada, lanjutkan dengan handler API
  return handler(req, res);
};
