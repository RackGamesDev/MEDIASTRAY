import fs from 'fs';
import path from 'path';

async function testFileReadWrite() {
  const TEST_DIR = process.env.PUBLIC_FILES_PATH;
  const FILE_NAME = 'test-file.txt';
  const FILE_PATH = path.join(TEST_DIR, FILE_NAME);
  const CONTENT_TO_WRITE = 'Hello, this is a test file created by Node.js!';

  try {
    await fs.promises.mkdir(TEST_DIR, { recursive: true });
    console.log(`Created directory: ${TEST_DIR}`);

    await fs.promises.writeFile(FILE_PATH, CONTENT_TO_WRITE);
    console.log(`Wrote to: ${FILE_PATH}`);

    const content = await fs.promises.readFile(FILE_PATH, 'utf8');
    console.log(`Read content:`, content);

    if (content.trim() === CONTENT_TO_WRITE) {
      console.log('File read successfully and matches expected content.');
    } else {
      console.error('File content mismatch.');
    }

  } catch (error) {
    console.error('Error during file operation:', error.message);
    throw error;
  } finally {
    try {
      await fs.promises.unlink(FILE_PATH);
      console.log(`Deleted file: ${FILE_PATH}`);
    } catch (unlinkError) {
      console.warn(`Could not delete file: ${unlinkError.message}`);
    }
  }
} 

// Run the test
const testFs = () => {
    testFileReadWrite()
  .then(() => console.log('FS PERFECTO Test completed successfully.'))
  .catch((error) => {
    console.error('Test failed:', error);
  });
}

export {testFs}