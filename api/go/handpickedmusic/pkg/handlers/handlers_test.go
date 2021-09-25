package handlers

import (
	"testing"
)

func testTest(t *testing.T) {
	t.Run("successful test", func(t *testing.T) {
		ok := test();
		if ok != "test" {
			t.Fatal("Error in test")
		}
	})
}
