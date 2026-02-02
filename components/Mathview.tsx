import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

interface MathJaxViewProps {
  content: string;
}

const MathJaxView: React.FC<MathJaxViewProps> = ({ content }) => {
  const [height, setHeight] = useState<number>(40);

  const html = useMemo(() => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <script>
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
      },
      svg: { fontCache: 'global' }
    };
  </script>

  <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>

  <style>
    body {
      margin: 0;
      padding: 8px;
      font-size: 16px;
      color: black;
      background: transparent;
      word-wrap: break-word;
    }
  </style>
</head>

<body>
  ${content}

  <script>
    setTimeout(() => {
      window.ReactNativeWebView.postMessage(
        document.body.scrollHeight.toString()
      );
    }, 300);
  </script>
</body>
</html>
`, [content]);

  const onMessage = (event: WebViewMessageEvent) => {
    const newHeight = Number(event.nativeEvent.data);
    if (!Number.isNaN(newHeight)) {
      setHeight(newHeight);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ height }}
        javaScriptEnabled
        scrollEnabled={false}
        onMessage={onMessage}
      />
    </View>
  );
};

export default MathJaxView;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
