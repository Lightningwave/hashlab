use base64::Engine;
pub fn encode(text: &str) -> String {
    base64::engine::general_purpose::STANDARD.encode(text.as_bytes())
}

pub fn decode(text: &str) -> Result<String, String> {
    match base64::engine::general_purpose::STANDARD.decode(text) {
        Ok(bytes) => match String::from_utf8(bytes) {
            Ok(s) => Ok(s),
            Err(_) => Err("Decoded bytes are not UTF-8".to_string()),
        },
        Err(_) => Err("Invalid Base64 input".to_string()),
    }
}

