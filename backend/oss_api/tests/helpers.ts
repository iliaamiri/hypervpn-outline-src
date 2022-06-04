import { agent as _request } from "supertest";
import getApplication from '../app';

export const request = _request(getApplication())