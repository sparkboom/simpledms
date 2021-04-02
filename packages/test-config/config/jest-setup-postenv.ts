const { createSerializer } = require('enzyme-to-json');

// Configure Enzyme Serializer
expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));
