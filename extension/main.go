package internal

import (
	"go.k6.io/k6/js/modules"
)

// init is called by the Go runtime at application startup.
func init() {
	modules.Register("k6/x/internal", new(Internal))
}

// Internal is the type for our custom API.
type Internal struct {
	CheckResult string // textual description of the most recent result
}

// IsDriverValid checks if the driver is valid
func (i *Internal) IsDriverValid(driver string) bool {
	if len(driver) == 8 {
		i.CheckResult = "the driver is valid"
		return true
	} else {
		i.CheckResult = "the driver is invalid"
		return false
	}
}
