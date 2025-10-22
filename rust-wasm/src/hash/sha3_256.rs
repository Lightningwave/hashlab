// SHA3-256 hashing - produces a 256-bit (32-byte) hash using the Keccak algorithm
// SHA-3 is the latest member of the Secure Hash Algorithm family, standardized by NIST in 2015
use sha3::{Sha3_256, Digest};

pub fn hash(text: &str) -> String {
    // Create a new SHA3-256 hasher
    let mut hasher = Sha3_256::new();
    
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
    fn test_sha3_256_empty() {
        // SHA3-256 of empty string
        let hash = hash("");
        assert_eq!(hash, "a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a");
    }

    #[test]
    fn test_sha3_256_hello() {
        // SHA3-256 of "Hello, World!"
        let hash = hash("Hello, World!");
        assert_eq!(hash, "1af17a664e3fa8e419b8ba05c2a173169df76162a5a286e0c405b460d478f7ef");
    }
}

