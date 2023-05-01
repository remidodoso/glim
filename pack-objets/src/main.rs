//
// pack-objets --name <collection-name> <filenames>
// e.g.
//   pack-objets --name collibrina-1 photo1.jpg photo2.jpg photo3.jpg
//

use clap::{arg, Command};
use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

fn main() {
    let begin_objet_files_marker = "// BEGIN OBJET FILES";
    let end_objet_files_marker = "// END OBJET FILES";
    let root_js_name = "/mnt/c/Users/Joseph/dev/glim/glim/main.js";
    
    let cmd = Command::new("prog")
        .args(&[
            arg!(-d --display_name <display_name> "gallery display name"),
            arg!(-z --zip_name <zip_name> "gallery zip name"),
            arg!(<file>... "input file(s)"),
    ]);

    let m = cmd.get_matches();
    println!("display name: {:?}", m.get_one::<String>("display_name").unwrap());
    println!("zip name: {:?}", m.get_one::<String>("zip_name").unwrap());
    for fname in m.get_many::<String>("file")
            .unwrap()
            .map(|s| s.as_str()) {
        println!("file(s): {:?}", fname);
    }

//    let mut root_file = File::open(root_file_name);
    if let Ok(lines) = read_lines(root_js_name) {
        for line in lines {
            let l = line.unwrap();
            if l.contains(begin_objet_files_marker) {
                println!("Start");
            } else if l.contains(end_objet_files_marker) {
                println!("End");
            }
        }
    }
}

fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where P: AsRef<Path>, {
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}
