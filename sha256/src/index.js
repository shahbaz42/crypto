/* ------- SHA-256 constants (Section 4.2.2) ------- */

/**
 * Checks if a number is prime.
 * @param {number} n - The number to check.
 * @returns {boolean} - True if the number is prime, false otherwise.
 */
function isPrime(n) {
    let sqrtN = Math.sqrt(n);
    for (let factor = 2; factor <= sqrtN; factor++) {
        if (n % factor === 0) {
            return false;
        }
    }
    return true;
}

/**
 * Generates an array of the first n prime numbers.
 *
 * @param {number} n - The number of prime numbers to generate.
 * @returns {number[]} - An array containing the first n prime numbers.
 */
function first_n_primes(n) {
    let primes = [];
    let i = 2;
    while (primes.length < n) {
        if (isPrime(i)) {
            primes.push(i);
        }
        i++;
    }
    return primes;
}

/**
 * Retruns first n bits of a fractional part of a floating number
 * @param {number} x - The number to get the fractional part from.
 * @param {number} n - The number of bits to get.
 * @returns {number} - The first n bits of the fractional part of x.
 */
function fractionalBits(x, n) {
    x = x - Math.floor(x); // get fractional part
    x = x * Math.pow(2, n); // shift left by n bits
    x = Math.floor(x);
    return x;
}

/**
 * Generates the first thirty-two bits of the fractional parts 
 * of the cube roots of the first sixty-four prime numbers. (Section 4.2.2)
 * @returns {number[]} - The first thirty-two bits of the fractional parts
 * of the cube roots of the first sixty-four prime numbers.
 * SHA-256 constants (Section 4.2.2) [
  '428a2f98', '71374491', 'b5c0fbcf', 'e9b5dba5',
  '3956c25b', '59f111f1', '923f82a4', 'ab1c5ed5',
  'd807aa98', '12835b01', '243185be', '550c7dc3',
  '72be5d74', '80deb1fe', '9bdc06a7', 'c19bf174',
  'e49b69c1', 'efbe4786', 'fc19dc6',  '240ca1cc',
  '2de92c6f', '4a7484aa', '5cb0a9dc', '76f988da',
  '983e5152', 'a831c66d', 'b00327c8', 'bf597fc7',
  'c6e00bf3', 'd5a79147', '6ca6351',  '14292967',
  '27b70a85', '2e1b2138', '4d2c6dfc', '53380d13',
  '650a7354', '766a0abb', '81c2c92e', '92722c85',
  'a2bfe8a1', 'a81a664b', 'c24b8b70', 'c76c51a3',
  'd192e819', 'd6990624', 'f40e3585', '106aa070',
  '19a4c116', '1e376c08', '2748774c', '34b0bcb5',
  '391c0cb3', '4ed8aa4a', '5b9cca4f', '682e6ff3',
  '748f82ee', '78a5636f', '84c87814', '8cc70208',
  '90befffa', 'a4506ceb', 'bef9a3f7', 'c67178f2'
 ]
 */
function generateK() {
    let primes = first_n_primes(64);
    let k = [];
    for (let i = 0; i < 64; i++) {
        k.push(fractionalBits(Math.cbrt(primes[i]), 32));
    }
    return k;
}

/**
 * Generates initial Hash value H^0
 * 
 * H^0 = The first thirty-two bits of the fractional parts
 * of the square roots of the first eight prime numbers. (Section 5.3.3)
 * @returns {number[]} - Initial Hash value H^0
 * [6a09e667 bb67ae85 3c6ef372 a54ff53a 9b05688c 510e527f 1f83d9ab 5be0cd19]
 */
function generateH() {
    let primes = first_n_primes(8);
    let h = [];
    for (let i = 0; i < 8; i++) {
        h.push(fractionalBits(Math.sqrt(primes[i]), 32));
    }
    return h;
}



/* ---------- SHA-256 helper functions (Section 4.2) ---------- */

/**
 * Performs a right rotation (ROTR) operation on a given number. Section 3.2)
 * @param {number} x - The number to be rotated.
 * @param {number} n - The number of positions to rotate by.
 * @param {number} [w=32] - The word size in bits. Defaults to 32.
 * @returns {number} The result of the right rotation operation.
 */
function ROTR(x, n, w = 32) {
    return (x >>> n) | (x << (32 - n));
}

/**
 * Performs a right shift (SHR) operation on a given number. (Section 3.2)
 * @param {number} x - The number to be shifted.
 * @param {number} n - The number of positions to shift by.
 * @returns {number} The result of the right shift operation.
 */
function SHR(x, n) {
    return x >>> n;
}

/**
 * Calculates the CH (choose) function. (Section 4.1.2)
 * @param {number} x - The first input.
 * @param {number} y - The second input.
 * @param {number} z - The third input.
 * @returns {number} The result of the CH function.
 */
function CH(x, y, z) {
    return (x & y) ^ (~x & z);
}


/**
 * Performs the MAJ operation on three input values. Section 4.1.2)
 * @param {number} x - The first input value.
 * @param {number} y - The second input value.
 * @param {number} z - The third input value.
 * @returns {number} - The result of the MAJ operation.
 */
function MAJ(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
}

/**
 * Performs the sigma0 operation on a given number. (Section 4.1.2)
 * @param {number} x - The input value.
 * @returns {number} - The result of the sigma0 operation.
 */
function sigma0(x) {
    return ROTR(x, 7, 32) ^ ROTR(x, 18, 32) ^ SHR(x, 3, 32);
}

/**
 * Performs the sigma1 operation on a given number. (Section 4.1.2)
 * @param {number} x - The input value.
 * @returns {number} - The result of the sigma1 operation.
 */
function sigma1(x) {
    return ROTR(x, 17, 32) ^ ROTR(x, 19, 32) ^ SHR(x, 10, 32);
}

/**
 * Performs the SIGMA0  operation on a given number. (Section 4.1.2)
 * @param {number} x - The input value.
 * @returns {number} - The result of the SIGMA0 operation.
 */
function SIGMA0(x) {
    return ROTR(x, 2, 32) ^ ROTR(x, 13, 32) ^ ROTR(x, 22, 32);
}

/**
 * Performs the SIGMA1 operation on a given number. (Section 4.1.2)
 * @param {number} x - The input value.
 * @returns {number} - The result of the SIGMA1 operation.
 */
function SIGMA1(x) {
    return ROTR(x, 6, 32) ^ ROTR(x, 11, 32) ^ ROTR(x, 25, 32);
}

/**
 * Converts a binary string to an integer.
 * 
 * @param {string} bin - The binary string to convert.
 * @returns {number} The converted integer.
 */
function bin2int(bin) {
    return parseInt(bin, 2);
}

/**
 * Converts an integer to a binary string representation.
 * @param {number} int - The integer to convert.
 * @returns {string} The binary string representation of the integer.
 */
function int2bin(int) {
    return int.toString(2);
}

/* ------------------- Utility functions ------------------- */


/**
 * // To remove, no need for it
 * Converts a string to a byte array. 
 * @param {string} str - The string to convert.
 * @returns {Uint8Array} The byte array representation of the string.
 */
function stringToByteArray(str) {
    const encoder = new TextEncoder('utf-8');
    return encoder.encode(str);
}

/* ---------- SHA-256 preprocessing (Section 6.2) ---------- */


/**
 * Pads the given message according to the SHA-1 padding scheme.
 * 
 * @param {string} message - The message to be padded.
 * @returns {number[]} - The padded message as a byte array.
 */
function padMessage(message) {
    let byteArr = new TextEncoder('utf-8').encode(message);
    let length = byteArr.length * 8;
    // console.log(`Message length: ${length}bits`)

    // Convert to binary string
    let binaryStr = "";
    for (let i = 0; i < byteArr.length; i++) {
        binaryStr += byteArr[i].toString(2).padStart(8, '0');
    }

    // Append 1
    binaryStr += "1";

    // Append k 0s
    let k = 448 - (binaryStr.length % 512);
    if (k < 0) {
        k += 512;
    }
    binaryStr += "0".repeat(k);

    // Append length as 64-bit big-endian integer
    binaryStr += length.toString(2).padStart(64, '0');

    // Convert back to byte array
    let paddedByteArr = [];
    for (let i = 0; i < binaryStr.length; i += 8) {
        paddedByteArr.push(parseInt(binaryStr.slice(i, i + 8), 2));
    }
    // console.log(`Padded message length: ${paddedByteArr.length*8}bits`)
    return (paddedByteArr)
}

/* ---------- SHA-256 main functions (Section 6.2) ---------- */

/**
 * Calculates the SHA-256 hash of the given message.
 * 
 * @param {string} b - The message to be hashed.
 * @returns {string} - The SHA-256 hash of the message.
 */
function sha256(b) {
    // Padding the message
    b = padMessage(b);

    // Generate K
    const K = generateK();

    // Generate H^0 (Section 5.3.3)
    let H = generateH();

    // console.log(b.length) // 64 or 128 bytes
    const blocks = [];
    for (let i = 0; i < b.length; i += 64) {
        // one whole block of 64bytes or 512bits
        blocks.push(b.slice(i, i + 64))
    }

    // console.log(blocks)
    blocks.forEach(block => {
        // console.log(block)
        // Each block is an array of 64 entries, each entry is 8bit number
        // total size = 64*8 = 512bits

        // 1. Prepare the message schedule (Section 6.2.2)
        const W = new Array(64); //each entry is a 32bit number 
        for (let t = 0; t < 16; t++) { // 16 entries of 32bit each copied from the entire block
            W[t] = (block[t * 4] << 24) | (block[t * 4 + 1] << 16) | (block[t * 4 + 2] << 8) | (block[t * 4 + 3]); // accomodating 8it numbers into 32bit by shifting 
        }

        for (let t = 16; t < 64; t++) { // remaining 48 entries of 32bit each, calculated from the previous 16 entries
            W[t] = (sigma1(W[t - 2]) + W[t - 7] + sigma0(W[t - 15]) + W[t - 16]) >>> 0; // >>> 0: Zero-fill right shift, converting the result to a 32-bit unsigned integer.
        }

        // console.log(W)

        // 2. Initialize the eight working variables (Section 6.2.2)
        let [a, b, c, d, e, f, g, h] = H; // remove the function and use the constant directly

        // 3.
        for (let t = 0; t < 64; t++) {
            const T1 = h + SIGMA1(e) + CH(e, f, g) + K[t] + W[t];
            const T2 = SIGMA0(a) + MAJ(a, b, c);
            h = g;
            g = f;
            f = e;
            e = (d + T1) >>> 0; // >>> 0: Zero-fill right shift, converting the result to a 32-bit unsigned integer.
            d = c;
            c = b;
            b = a;
            a = (T1 + T2) % 2 ** 32;
        }

        // 4. Compute the i-th intermediate hash value H^i (Section 6.2.2)  
        H = H.map((value, index) => (value + [a, b, c, d, e, f, g, h][index]) >>> 0);

    });

    // 6. Produce the final hash value (big-endian) (Section 6.2.2)
    let hash = "";
    for (let i = 0; i < 8; i++) {
        hash += H[i].toString(16).padStart(8, '0');
    }
    return hash;
}

export default sha256;