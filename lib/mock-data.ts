import { Vehicle } from "@/types";

export const baseVehicles: Vehicle[] = [
    {
        id: "1",
        vin: "1FTEW1E50KFA12345",
        make: "Ford",
        model: "F-150 Lariat",
        year: 2021,
        price: 45000,
        mileage: 28000,
        bodyType: "Truck",
        fuelType: "Gasoline",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?auto=format&fit=crop&q=80&w=2070",
        condition: "Used",
        exteriorColor: "Agate Black",
        interiorColor: "Black Leather",
        features: "Navigation, Heated Seats, Tow Package",
        carfaxUrl: "/carfax-report/1",
    },
    {
        id: "2",
        vin: "3GNCJKS09L2345678",
        make: "Chevrolet",
        model: "Silverado 1500 RST",
        year: 2022,
        price: 48500,
        mileage: 15000,
        bodyType: "Truck",
        fuelType: "Gasoline",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1551830820-330a71b99659?q=80&w=2070&auto=format&fit=crop",
        condition: "Certified Pre-Owned",
        exteriorColor: "Summit White",
        interiorColor: "Jet Black",
        features: "Apple CarPlay, Remote Start, Z71 Package",
        carfaxUrl: "/carfax-report/2",
    },
    {
        id: "3",
        vin: "5YJ3E1EA5LF987654",
        make: "Tesla",
        model: "Model 3 Long Range",
        year: 2023,
        price: 38900,
        mileage: 8500,
        bodyType: "Sedan",
        fuelType: "Electric",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2671&auto=format&fit=crop",
        condition: "Used",
        exteriorColor: "Deep Blue Metallic",
        interiorColor: "Black",
        features: "Autopilot, Premium Interior, Glass Roof",
        carfaxUrl: "/carfax-report/3",
    },
    {
        id: "4",
        vin: "4T1B11HK8JU123987",
        make: "Toyota",
        model: "Camry TRD",
        year: 2022,
        price: 32000,
        mileage: 22000,
        bodyType: "Sedan",
        fuelType: "Gasoline",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=2069",
        condition: "Certified Pre-Owned",
        exteriorColor: "Wind Chill Pearl",
        interiorColor: "Red/Black",
        features: "TRD Performance Exhaust, Sport Seats, JBL Audio",
        carfaxUrl: "/carfax-report/4",
    },
    {
        id: "5",
        vin: "WBA73CJ05L5551234",
        make: "BMW",
        model: "330i xDrive",
        year: 2021,
        price: 36500,
        mileage: 31000,
        bodyType: "Sedan",
        fuelType: "Gasoline",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1556189250-72ba95452242?auto=format&fit=crop&q=80&w=1200",
        condition: "Used",
        exteriorColor: "Alpine White",
        interiorColor: "Canberra Beige",
        features: "Live Cockpit Pro, Heated Steering Wheel, Park Distance Control",
        carfaxUrl: "/carfax-report/5",
    },
    {
        id: "6",
        vin: "JTEZU5JR7K0098765",
        make: "Toyota",
        model: "4Runner TRD Pro",
        year: 2020,
        price: 46000,
        mileage: 45000,
        bodyType: "SUV",
        fuelType: "Gasoline",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&q=80&w=1200",
        condition: "Used",
        features: "Bluetooth, Backup Camera, Keyless Entry, Crawl Control, Multi-Terrain Select",
        carfaxUrl: "/carfax-report/6",
        exteriorColor: "Army Green",
        interiorColor: "Black",
    },
    {
        id: "7",
        vin: "1G1YC2D70K5123456",
        make: "Chevrolet",
        model: "Corvette Stingray",
        year: 2023,
        price: 78000,
        mileage: 3500,
        bodyType: "Coupe",
        fuelType: "Gasoline",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2670&auto=format&fit=crop",
        condition: "Used",
        exteriorColor: "Torch Red",
        interiorColor: "Adrenaline Red",
        features: "Z51 Performance Package, GT2 Buckets, Front Lift",
        carfaxUrl: "/carfax-report/7",
    },
    {
        id: "8",
        vin: "WA1LGAF12KD098123",
        make: "Audi",
        model: "Q7 55 TFSI",
        year: 2022,
        price: 55000,
        mileage: 19000,
        bodyType: "SUV",
        fuelType: "Gasoline",
        transmission: "Automatic",
        image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop",
        condition: "Certified Pre-Owned",
        exteriorColor: "Glacier White",
        interiorColor: "Black",
        features: "Quattro AWD, Virtual Cockpit, Bang & Olufsen 3D Sound",
        carfaxUrl: "/carfax-report/8",
    },
];

// Helper to generate distinct vehicles
const generateMoreVehicles = (startId: number, count: number): Vehicle[] => {
    const makesAndModels = [
        { make: "Ford", models: ["Mustang GT", "Explorer XLT", "Escape SE", "Edge Titanium"] },
        { make: "Chevrolet", models: ["Tahoe Z71", "Equinox LT", "Malibu Premier", "Camaro SS"] },
        { make: "Toyota", models: ["RAV4 XLE", "Highlander Limited", "Tacoma TRD", "Corolla XSE"] },
        { make: "Honda", models: ["CR-V EX-L", "Civic Touring", "Accord Sport", "Pilot Touring"] },
        { make: "BMW", models: ["X5 xDrive40i", "530i Sedan", "X3 xDrive30i", "M4 Competition"] },
        { make: "Mercedes-Benz", models: ["C-Class C300", "GLE 350", "E-Class E350", "GLC 300"] },
        { make: "Jeep", models: ["Grand Cherokee", "Wrangler Unlimited", "Cherokee Latitude"] },
        { make: "Subaru", models: ["Outback Limited", "Forester Touring", "Crosstrek Premium"] },
        { make: "Lexus", models: ["RX 350", "ES 350", "NX 300"] },
        { make: "Audi", models: ["A4 Premium", "Q5 Premium Plus", "A6 Prestige"] }
    ];

    const colors = [
        { ext: "Silver Ice", int: "Black" }, { ext: "Shadow Black", int: "Gray" },
        { ext: "Oxford White", int: "Beige" }, { ext: "Rapid Red", int: "Black" },
        { ext: "Blue Metallic", int: "Gray" }, { ext: "Magnetic Gray", int: "Black" }
    ];

    // Curated list of high-quality Unsplash verified images for each category
    const categoryImages = {
        Truck: [
            "https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?auto=format&fit=crop&q=80&w=1200", // F-150 Grey
            "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&q=80&w=1200", // Silverado White
            "https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?auto=format&fit=crop&q=80&w=1200", // Tacoma Red
            "https://images.unsplash.com/photo-1587399580437-0245d1d6a362?auto=format&fit=crop&q=80&w=1200", // Ram
            "https://images.unsplash.com/photo-1566355675549-c124e4d50325?auto=format&fit=crop&q=80&w=1200"  // Jeep/Truck
        ],
        SUV: [
            "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1200", // Audi Q7
            "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&q=80&w=1200", // 4Runner Green
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1200", // Tahoe
            "https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?auto=format&fit=crop&q=80&w=1200", // Wrangler
            "https://images.unsplash.com/photo-1614200179396-2777cb79adb5?auto=format&fit=crop&q=80&w=1200", // White SUV
            "https://images.unsplash.com/photo-1628891435256-3f71e2e28351?auto=format&fit=crop&q=80&w=1200", // CR-V/SUV style
            "https://images.unsplash.com/photo-1570733117311-d990c3816c47?auto=format&fit=crop&q=80&w=1200"  // Range Rover/Lux SUV
        ],
        Sedan: [
            "https://images.unsplash.com/photo-1556189250-72ba95452242?auto=format&fit=crop&q=80&w=1200", // BMW 3 White
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200", // Tesla Model 3
            "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=1200", // Camry TRD
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1200", // Mercedes C-Class
            "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=1200", // Red Sport Sedan
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200", // Generic Luxury
            "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=1200"  // Audi Sedan
        ],
        Coupe: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200", // Corvette Red
            "https://images.unsplash.com/photo-1580273916550-e323be2ebcc3?auto=format&fit=crop&q=80&w=1200", // Mustang Red
            "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200", // Porsche
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200", // Lexus
            "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80&w=1200"  // Mustang Grey
        ],
        Electric: [
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1200", // Tesla
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1200", // Mercedes EQ style
            "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=1200"  // Charging
        ]
    };

    const newVehicles: Vehicle[] = [];

    for (let i = 0; i < count; i++) {
        const id = (startId + i).toString();
        const makeModel = makesAndModels[Math.floor(Math.random() * makesAndModels.length)];
        const model = makeModel.models[Math.floor(Math.random() * makeModel.models.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];

        let bodyType = "Sedan";
        if (model.includes("X5") || model.includes("GLE") || model.includes("RAV4") || model.includes("CR-V") || model.includes("Tahoe") || model.includes("Explorer") || model.includes("Pilot") || model.includes("Grand Cherokee") || model.includes("Wrangler") || model.includes("Outback") || model.includes("Highlander") || model.includes("RX") || model.includes("NX") || model.includes("Q5") || model.includes("Edge") || model.includes("Equinox")) bodyType = "SUV";
        if (model.includes("F-150") || model.includes("Tacoma") || model.includes("Silverado")) bodyType = "Truck";
        if (model.includes("Mustang") || model.includes("Camaro") || model.includes("M4") || model.includes("Corvette")) bodyType = "Coupe";

        // Select random image from appropriate category
        const imageList = categoryImages[bodyType as keyof typeof categoryImages] || categoryImages.Sedan;
        const imageIndex = Math.floor(Math.random() * imageList.length);
        const image = imageList[imageIndex];

        const year = Math.floor(Math.random() * (2024 - 2018 + 1)) + 2018;
        const mileage = Math.floor(Math.random() * 80000) + 5000;
        const price = Math.floor(Math.random() * (75000 - 20000 + 1)) + 20000;

        newVehicles.push({
            id,
            vin: Math.random().toString(36).substring(7).toUpperCase() + Math.random().toString(36).substring(7).toUpperCase(),
            make: makeModel.make,
            model,
            year,
            price: Math.round(price / 100) * 100, // round to nearest 100
            mileage: Math.round(mileage / 100) * 100,
            bodyType,
            fuelType: "Gasoline",
            transmission: "Automatic",
            image,
            condition: mileage < 30000 ? "Certified Pre-Owned" : "Used",
            exteriorColor: color.ext,
            interiorColor: color.int,
            features: "Bluetooth, Backup Camera, Keyless Entry, Apple CarPlay",
            carfaxUrl: `/carfax-report/${id}`,
        });
    }

    return newVehicles;
};

export const vehicles: Vehicle[] = [
    ...baseVehicles,
    ...generateMoreVehicles(9, 92) // Generate 92 more to reach 100 total
];
