use ic_cdk::api::call;
use ic_cdk::export::Principal;
use ic_cdk::storage;
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct FileMetadata {
    pub name: String,
    pub size: u64,
    pub date_uploaded: String,
}

#[derive(Default)]
pub struct CloudStorage {
    pub files: HashMap<String, FileMetadata>,
}

#[ic_cdk_macros::update]
pub fn upload_file(name: String, size: u64, date_uploaded: String) {
    let metadata = FileMetadata {
        name: name.clone(),
        size,
        date_uploaded,
    };
    let mut storage = storage::get_mut::<CloudStorage>();
    storage.files.insert(name, metadata);
}

#[ic_cdk_macros::query]
pub fn get_file_metadata(name: String) -> Option<FileMetadata> {
    let storage = storage::get::<CloudStorage>();
    storage.files.get(&name).cloned()
}

#[ic_cdk_macros::update]
pub fn delete_file(name: String) {
    let mut storage = storage::get_mut::<CloudStorage>();
    storage.files.remove(&name);
}
