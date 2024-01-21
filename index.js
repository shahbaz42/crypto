// SHA-256 constants (Section 4.2.2)

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




