// BLAKE2b hashing - produces a 512-bit (64-byte) hash
// BLAKE2 is a cryptographic hash function faster than MD5, SHA-1, SHA-2, and SHA-3,
// yet is at least as secure as the latest standard SHA-3.
// BLAKE2b is optimized for 64-bit platforms.
use blake2::{Blake2b512, Digest};

pub fn hash(text: &str) -> String {
    // Create a new BLAKE2b-512 hasher
    let mut hasher = Blake2b512::new();
    
    // Feed the input text into the hasher
    hasher.update(text.as_bytes());
    
    // Get the hash result as bytes
    let result = hasher.finalize();
    
    // Convert bytes to hexadecimal string
    hex::encode(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_blake2b_empty() {
        // BLAKE2b-512 of empty string
        let hash = hash("");
        assert_eq!(hash, "786a02f742015903c6c6fd852552d272912f4740e15847618a86e217f71f5419d25e1031afee585313896444934eb04b903a685b1448b755d56f701afe9be2ce");
    }

    #[test]
    fn test_blake2b_hello() {
        // BLAKE2b-512 of "Hello, World!"
        let hash = hash("Hello, World!");
        // This will verify the hash is 128 hex chars (64 bytes)
        assert_eq!(hash.len(), 128);
    }
}

