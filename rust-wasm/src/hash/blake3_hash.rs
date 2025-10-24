// BLAKE3 hashing - produces a 256-bit (32-byte) hash by default


pub fn hash(text: &str) -> String {
    // Create a new BLAKE3 hasher and hash the input
    let hash = blake3::hash(text.as_bytes());
    
    // Convert bytes to hexadecimal string
    hex::encode(hash.as_bytes())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_blake3_empty() {
        // BLAKE3 of empty string
        let hash = hash("");
        assert_eq!(hash, "af1349b9f5f9a1a6a0404dea36dcc9499bcb25c9adc112b7cc9a93cae41f3262");
    }

    #[test]
    fn test_blake3_hello() {
        // BLAKE3 of "Hello, World!"
        let hash = hash("Hello, World!");
        assert_eq!(hash, "ede5c0b10f2ec4979c69b52f61e42ff5b413519ce09be0f14d098dcfe5f6f98d");
    }
}

