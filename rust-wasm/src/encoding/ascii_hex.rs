// ASCII <-> Hex converter (simple and explicit)

pub fn ascii_to_hex(text: &str) -> String {
    let bytes = text.as_bytes();
    hex::encode(bytes)
}

pub fn hex_to_ascii(text: &str) -> Result<String, String> {
    match hex::decode(text) {
        Ok(bytes) => match String::from_utf8(bytes) {
            Ok(s) => Ok(s),
            Err(_) => Err("Decoded bytes are not UTF-8".to_string()),
        },
        Err(_) => Err("Invalid hex input".to_string()),
    }
}

