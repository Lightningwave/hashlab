use image::{DynamicImage, GenericImageView};

const HEADER_SIZE: usize = 4;

/// Calculate the maximum capacity of an image for hiding data (in bytes)
pub fn calculate_capacity(width: u32, height: u32) -> usize {
    // Each pixel has 4 channels (RGBA), we can use 3 bits per pixel (1 from RGB)
    // To be safe and maintain quality, we'll use 1 bit per color channel (3 bits per pixel)
    let total_pixels = (width * height) as usize;
    let total_bits = total_pixels * 3; // 3 bits per pixel (R, G, B)
    let total_bytes = total_bits / 8;
    
    // Subtract header size
    total_bytes.saturating_sub(HEADER_SIZE)
}

/// Encode data into a PNG image using LSB steganography
pub fn encode(img: &DynamicImage, data: &[u8]) -> Result<DynamicImage, String> {
    let (width, height) = img.dimensions();
    let capacity = calculate_capacity(width, height);
    
    if data.len() > capacity {
        return Err(format!(
            "Data too large: {} bytes, but image capacity is {} bytes",
            data.len(),
            capacity
        ));
    }
    
    let mut output = img.to_rgba8();
    
    // Encode data length in first 4 bytes (32 bits)
    let length = data.len() as u32;
    let length_bytes = length.to_be_bytes();
    
    // Combine length and data
    let mut full_data = Vec::with_capacity(HEADER_SIZE + data.len());
    full_data.extend_from_slice(&length_bytes);
    full_data.extend_from_slice(data);
    
    // Convert bytes to bits
    let bits: Vec<u8> = full_data
        .iter()
        .flat_map(|byte| (0..8).rev().map(move |i| (byte >> i) & 1))
        .collect();
    
    let mut bit_index = 0;
    'outer: for y in 0..height {
        for x in 0..width {
            if bit_index >= bits.len() {
                break 'outer;
            }
            
            let pixel = output.get_pixel_mut(x, y);
            
            // Encode in R, G, B channels (skip alpha)
            for channel in 0..3 {
                if bit_index >= bits.len() {
                    break 'outer;
                }
                
                // Clear LSB and set new bit
                pixel[channel] = (pixel[channel] & 0xFE) | bits[bit_index];
                bit_index += 1;
            }
        }
    }
    
    Ok(DynamicImage::ImageRgba8(output))
}

/// Decode data from a PNG image using LSB steganography
pub fn decode(img: &DynamicImage) -> Result<Vec<u8>, String> {
    let (width, height) = img.dimensions();
    let rgba = img.to_rgba8();
    
    // First, extract the length (first 32 bits)
    let mut length_bits = Vec::with_capacity(32);
    let mut bit_count = 0;
    
    'length_loop: for y in 0..height {
        for x in 0..width {
            if bit_count >= 32 {
                break 'length_loop;
            }
            
            let pixel = rgba.get_pixel(x, y);
            
            for channel in 0..3 {
                if bit_count >= 32 {
                    break 'length_loop;
                }
                
                length_bits.push(pixel[channel] & 1);
                bit_count += 1;
            }
        }
    }
    
    // Convert length bits to u32
    let mut length_bytes = [0u8; 4];
    for i in 0..4 {
        let byte_bits = &length_bits[i * 8..(i + 1) * 8];
        let mut byte = 0u8;
        for (j, &bit) in byte_bits.iter().enumerate() {
            byte |= bit << (7 - j);
        }
        length_bytes[i] = byte;
    }
    let data_length = u32::from_be_bytes(length_bytes) as usize;
    
    // Validate length
    let max_capacity = calculate_capacity(width, height);
    if data_length > max_capacity {
        return Err(format!(
            "Invalid data length: {} bytes (max capacity: {})",
            data_length, max_capacity
        ));
    }
    
    // Extract data bits
    let total_bits_needed = 32 + (data_length * 8);
    let mut all_bits = Vec::with_capacity(total_bits_needed);
    bit_count = 0;
    
    'data_loop: for y in 0..height {
        for x in 0..width {
            if bit_count >= total_bits_needed {
                break 'data_loop;
            }
            
            let pixel = rgba.get_pixel(x, y);
            
            for channel in 0..3 {
                if bit_count >= total_bits_needed {
                    break 'data_loop;
                }
                
                all_bits.push(pixel[channel] & 1);
                bit_count += 1;
            }
        }
    }
    
    // Skip the length bits (first 32) and convert remaining bits to bytes
    let data_bits = &all_bits[32..];
    let mut data = Vec::with_capacity(data_length);
    
    for chunk in data_bits.chunks(8) {
        let mut byte = 0u8;
        for (i, &bit) in chunk.iter().enumerate() {
            byte |= bit << (7 - i);
        }
        data.push(byte);
    }
    
    // Return only the actual data length
    data.truncate(data_length);
    Ok(data)
}

#[cfg(test)]
mod tests {
    use super::*;
    use image::{RgbaImage};
    
    #[test]
    fn test_capacity_calculation() {
        let capacity = calculate_capacity(100, 100);
        assert!(capacity > 0);
    }
    
    #[test]
    fn test_encode_decode() {
        let img = DynamicImage::ImageRgba8(RgbaImage::new(100, 100));
        let data = b"Hello, World!";
        
        let encoded = encode(&img, data).unwrap();
        let decoded = decode(&encoded).unwrap();
        
        assert_eq!(data, &decoded[..]);
    }
}

