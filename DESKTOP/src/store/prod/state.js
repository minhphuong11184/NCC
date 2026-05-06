export default function() {
    return {
        currentRoutingData: [],
        marketsWithQuantity: [],
        routings: [],
        boms: [],
        goodsTypes: [{
                label: "TP",
                value: "TP",
                code: "TP"
            },
            {
                label: "BTP",
                value: "BTP",
                code: "BTP"
            },
            {
                label: "CLAIM",
                value: "CLAIM",
                code: "CLAIM",
              },
        ],
        factories: [{
                label: "Nhà máy CBG Thuận Hưng",
                value: "100000",
                factoryId: 100000,
                code: "TH",
                gdsx: 100374,
                mail: "duyhungwl@gmail.com"
            },
            {
                label: "Nhà máy CBG Yên Sơn 1",
                value: "100004",
                factoryId: 100004,
                code: "YS1",
                gdsx: 101863,
                mail: "khanhlq@woodsland.vn"
            },
            // {
            //     label: "Nhà máy CBG Quang Minh",
            //     value: "102427",
            //     factoryId: 102427,
            //     code: "QM",
            //     gdsx: 101684,
            //     mail: "thinq.woodsland@gmail.com"
            // },
            {
                label: "Nhà máy CBG Thái Bình",
                value: "100005",
                factoryId: 100005,
                code: "TB",
                gdsx: 101931,
                mail: "ducdai.gbb@gmail.com"
            }
        ]
    };
}