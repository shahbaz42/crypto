import sha256 from './index.js';

function sha256Test(message, expectedHash) {
    const actualHash = sha256(message);
    if (actualHash !== expectedHash) {
        throw new Error(`Expected hash "${expectedHash}" for "${message}", got "${actualHash}"`);
    }
    console.log(`✅ Test passed for "${message}"`);
}

sha256Test('', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
sha256Test('Hello, world!', '315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3');
sha256Test('The quick brown fox jumps over the lazy dog', 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592');
sha256Test('🤩', 'bdbfd7e5861b4ed538948ac6c398a645c955ba3af66da7049e548ac75fc15b5a');