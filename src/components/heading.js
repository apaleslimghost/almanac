import React from 'react';
import styled, {css} from 'styled-components';

const base = css`
font-weight: normal;
line-height: 1;
`;

const title = css`
${base}
font-family: MrsEavesSmallCaps;
`;

const subtitle = css`
${base}
font-family: ScalaSansCaps;
`;

export const H1 = styled.h1`${title}`;
export const H2 = styled.h2`${title}`;
export const H3 = styled.h3`${title}`;
export const H4 = styled.h4`${subtitle}`;
export const H5 = styled.h5`${subtitle}`;
export const H6 = styled.h6`${subtitle}`;