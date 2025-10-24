// Keccak-256 hashing - produces a 256-bit (32-byte) hash using the original Keccak algorithm

use sha3::{Keccak256, Digest};

pub fn hash(text: &str) -> String {
    // Create a new Keccak-256 hasher
    let mut hasher = Keccak256::new();
    
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
    fn test_keccak256_empty() {
        // Keccak-256 of empty string
        let hash = hash("");
        assert_eq!(hash, "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
    }

    #[test]
    fn test_keccak256_hello() {
        // Keccak-256 of "Hello, World!"
        let hash = hash("Hello, World!");
        assert_eq!(hash, "acaf3289d7b601cbd114fb36c4d29c85bbfd5e133f14cb355c3fd8d99367964f");
    }
}

