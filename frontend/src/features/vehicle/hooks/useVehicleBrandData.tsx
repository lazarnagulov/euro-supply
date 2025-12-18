import { useState } from "react";
import type { VehicleBrand, VehicleModel } from "../types/vehicle.types.ts";
import { vehicleService } from "../../../api/services/vehicleService.ts";

export const useVehicleBrandData = () => {
    const [brands, setBrands] = useState<VehicleBrand[]>([]);
    const [models, setModels] = useState<VehicleModel[]>([]);

    const loadBrands = async () => {
        const data = await vehicleService.getBrands();
        setBrands(data);
    };

    const loadModels = async (brandId: number) => {
        const data = await vehicleService.getModelsByBrand(brandId);
        setModels(data);
    };

    return { brands, models, setModels, loadBrands, loadModels };
};