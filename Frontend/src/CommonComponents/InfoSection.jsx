

"use client";
import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "./PrimaryButton";
import DropdownMenu from "./DropdownMenu";
import { Ellipsis } from "lucide-react";
import { useApiMutation } from "../CustomsHooks/useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import LoadingEffect from "./LoadingEffect";



// ===== Utilities =====
const getDurationUnit = (type) => {
    const units = {
        "hourly packages": "hour",
        "weekly packages": "week",
        "monthly packages": "month",
        "yearly packages": "year",
    };
    return units[type?.toLowerCase()] || "";
};





// ===== Sub Components =====
const FeaturesList = ({ features }) => (
    <ul className="text-gray-500 space-y-2 flex flex-col items-start justify-start text-left p-1">
        {features.map((f, idx) => (
            <p className="flex items-center gap-x-3">
                ✅ <li key={idx}> {f}</li>
            </p>
        ))}
    </ul>
);




const PackageCard = ({ item, isList, Package, redirect, isAdmin, onPackageDelete }) => {



    const navigation = useNavigate();

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-lg text-center border border-green-100 flex flex-col justify-between transition"
        >
            <div className="flex items-center justify-between">
                <h1 className="text-green-700 font-bold text-xl mb-4">{item?.packageType}</h1>
                {isAdmin && (
                    <DropdownMenu
                        position="right"
                        trigger={
                            <div className="cursor-pointer text-gray-500 hover:text-gray-800">
                                <Ellipsis size={18} />
                            </div>
                        }

                        items={[
                            {
                                label: "Remove Package",
                                onClick: () => onPackageDelete(),
                            },
                            {
                                label: "Edit Package",
                            },

                        ]}
                    />
                )}
            </div>

            {item.icon && <div className="text-green-500 flex justify-center mb-4">{item.icon}</div>}



            {isList ? <FeaturesList features={item.features} /> : <p className="text-gray-500">{item.desc}</p>}

            {item.price && (
                <p className="text-3xl font-extrabold text-green-700 mt-6">
                    Rs{item.price}
                    <span className="text-lg font-medium text-gray-600">/{getDurationUnit(item.packageType)}</span>
                </p>
            )}


            {
                redirect && <PrimaryButton
                    label="Booking Slots"
                    onClick={() => navigation(`/admin/${Package?._id}/${redirect}/${item?._id}`)}
                    className="mt-6"
                />
            }
            {
                !redirect && <PrimaryButton
                    label="Booking Slots"
                    onClick={() => navigation(`/${Package?._id}/booking-slots`)}
                    className="mt-6"
                />
            }


        </motion.div>
    )
};






// ===== Main Section =====
const InfoSection = memo(({ title, data, bgColor = "bg-white", textColor = "text-green-700", isList, isPackage, bookingSlotsRedirect, isAdmin }) => {


    const { isPending, mutateAsync } = useApiMutation('DELETE');

    const queryClient = useQueryClient();



    const handlePackageDelete = useCallback(async (packageId) => {
        try {
            const response = await mutateAsync({
                url: `/packages/delete-package/${packageId}`,
            });

            if (response.status === true) {
                queryClient.invalidateQueries(['package']);
            }

        } catch (error) {

        }
    }, [mutateAsync, queryClient])


    if (isPending) return <LoadingEffect />


    return (
        <section className={`px-6 md:px-16 py-16 ${bgColor}`}>
            <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${textColor}`}>
                {title}
            </h2>

            <div className={`grid ${isPackage ? "md:grid-cols-4" : "md:grid-cols-3"} gap-8`}>
                {data?.allPackages?.map((item, i) => (
                    <PackageCard
                        key={i}
                        item={item}
                        isList={isList}
                        Package={item}
                        redirect={bookingSlotsRedirect}
                        isAdmin={isAdmin}
                        onPackageDelete={() => handlePackageDelete(item?._id)}
                    />
                ))}
            </div>
        </section>
    );
});

export default InfoSection;
