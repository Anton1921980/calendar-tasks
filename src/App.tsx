import { Provider } from 'react-redux';
import { store } from './store';
import { Calendar } from './components/Calendar/Calendar';
import { Global } from '@emotion/react';

function App() {
  return (
    <Provider store={store}>
      <Global
        styles={{
          '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          },
          'html, body': {
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
          },
          body: {
            fontFamily: 
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            color: '#333333',
            lineHeight: 1.5,
          },
          '#root': {
            width: '100%',
            height: '100%',
          }
        }}
      />
      <Calendar />
    </Provider>
  );
}

export default App;
