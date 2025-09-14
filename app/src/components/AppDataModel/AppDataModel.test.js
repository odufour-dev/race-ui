import React from 'react';
import { render } from '@testing-library/react';
import AppDataModel from './AppDataModel';

describe('AppDataModel', () => {
  it('provides data and actions', () => {
    let received = null;
    render(
      <AppDataModel>
        {dataModel => {
          received = dataModel;
          return null;
        }}
      </AppDataModel>
    );
    expect(received).toBeTruthy();
    expect(Array.isArray(received.data)).toBe(true);
    expect(typeof received.addRow).toBe('function');
  });
});
