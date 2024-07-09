const canvas = new fabric.Canvas('canvas');
const socket = io('http://localhost:5000');

socket.on('update', (data) => {
  if (data.type === 'image') {
    fabric.Image.fromURL(data.url, (img) => {
      img.set(data.props);
      canvas.add(img);
    });
  } else if (data.type === 'text') {
    const text = new fabric.Text(data.text, data.props);
    canvas.add(text);
  } else if (data.type === 'rect') {
    const rect = new fabric.Rect(data.props);
    canvas.add(rect);
  }
});

function addRectangle() {
  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 100,
    height: 100,
  });
  canvas.add(rect);
  const props = rect.toObject(['left', 'top', 'width', 'height', 'fill', 'angle']);
  socket.emit('update', { type: 'rect', props });
}

function addText() {
  const text = new fabric.Text('Hello World!', {
    left: 100,
    top: 100,
    fontSize: 20,
    fontFamily: 'Arial',
  });
  canvas.add(text);
  const props = text.toObject(['left', 'top', 'fontSize', 'fontFamily', 'angle']);
  socket.emit('update', { type: 'text', text: 'Hello World!', props });
}

function pasteImage() {
  const url = prompt('Enter image URL:');
  fabric.Image.fromURL(url, (img) => {
    canvas.add(img);
    const props = img.toObject(['left', 'top', 'scaleX', 'scaleY', 'angle']);
    socket.emit('update', { type: 'image', url, props });
  });
}
