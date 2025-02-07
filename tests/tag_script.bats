#!/usr/bin/env bats
source ../tag.sh

setup() {
    # Create a temporary test directory
    TEST_DIR="test_images"
    mkdir -p "$TEST_DIR"

    # Create test files
    touch "$TEST_DIR/file1.jpg"
    touch "$TEST_DIR/file 2.jpg"
}

teardown() {
    # Cleanup after tests
    rm -rf "$TEST_DIR"
}

@test "rename_file should rename file with spaces" {
    run rename_file "$TEST_DIR/file 2.jpg"
    [ "$status" -eq 0 ]
    [ -f "$TEST_DIR/file_2.jpg" ]
    [[ "$output" == *"✅ Renamed"* ]]
}

@test "rename_file should do nothing if no spaces exist" {
    run rename_file "$TEST_DIR/file1.jpg"
    [ "$status" -eq 0 ]
    [ -f "$TEST_DIR/file1.jpg" ]
}

@test "rename_file should return error for nonexistent file" {
    run rename_file "$TEST_DIR/nonexistent.jpg"
    [ "$status" -ne 0 ]
    [[ "$output" == *"Error: File"* ]]
}

@test "remove_tags should call tag command" {
    run remove_tags "$TEST_DIR/file1.jpg"
    [ "$status" -eq 0 ]

}
