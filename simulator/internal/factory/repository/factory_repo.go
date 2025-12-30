package repository

import (
	"database/sql"
	"eurosupply/simulator/internal/factory/domain"

	_ "github.com/lib/pq"
)

type FactoryRepository struct {
	db *sql.DB
}

func NewFactoryRepository(db *sql.DB) *FactoryRepository {
	return &FactoryRepository{db: db}
}

func (r *FactoryRepository) GetAllFactories() ([]domain.Factory, error) {
	rows, err := r.db.Query("SELECT id FROM factories")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var factories []domain.Factory
	for rows.Next() {
		var f domain.Factory
		if err := rows.Scan(&f.ID); err != nil {
			return nil, err
		}
		factories = append(factories, f)
	}
	return factories, nil
}

func (r *FactoryRepository) GetProductsForFactory(factoryID int64) ([]domain.ProductConfig, error) {
	query := `
        SELECT p.id
        FROM products p
        JOIN product_factory pf ON pf.product_id = p.id
        WHERE pf.factory_id = $1
    `
	rows, err := r.db.Query(query, factoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []domain.ProductConfig
	for rows.Next() {
		var p domain.ProductConfig
		if err := rows.Scan(&p.ProductID); err != nil {
			return nil, err
		}
		products = append(products, p)
	}
	return products, nil
}
