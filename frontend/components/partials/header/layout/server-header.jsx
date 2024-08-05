// app/components/partials/header/layout/server-header.jsx
import React from 'react';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import config  from '../../../../config';
import ClassicHeader from './classic-header';

export default function ServerHeader({ children, className }) {
  const headerCookies = headers().get('cookie');
  const initialState = cookieToInitialState(config(), headerCookies);

  return <ClassicHeader initialState={initialState} className={className}>{children}</ClassicHeader>;
}
