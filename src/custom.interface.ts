import { Request } from 'express';

interface CustomRequest extends Request {
  user: {
    sub: number;
    email: string;
  };
}

export default CustomRequest;
