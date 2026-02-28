package generator

import "time"

type Factory struct {
	ID       int64
	Products []Product
}

type Product struct {
	ProductID int64
	MinQty    int
	MaxQty    int
}

type ProductionRecord struct {
	FactoryID int64
	ProductID int64
	Quantity  int
	Timestamp time.Time
}
