import api from './api';
import { auth } from './api/auth';
import { dues } from './api/dues';
import { retailers } from './api/retailers';
import { transactions } from './api/transactions';
import { profile } from './api/profile';
import { dashboard } from './api/dashboard';
import { fintech } from './api/fintech';

export {
  auth,
  dues,
  retailers,
  transactions,
  profile,
  dashboard,
  fintech,
  api as default
};