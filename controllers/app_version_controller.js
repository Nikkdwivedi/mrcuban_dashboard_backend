import { AppVersion } from "../models/appVersion.js";

/**
 * @desc Create new App Version
 * @route POST /api/version/create
 */
export const createAppVersion = async (req, res) => {
  try {
    const { appFor, appVersion, apkUrl, appMsg, timeToShow } = req.body;

    if (!appFor || !appVersion || !apkUrl) {
      return res.status(400).json({
        success: false,
        message: "appFor, appVersion, and apkUrl are required.",
      });
    }

    // Mark existing versions of the same appFor as inactive
    await AppVersion.updateMany({ appFor }, { status: "inactive" });

    // Create a new version entry
    const version = await AppVersion.create({
      appFor,
      appVersion,
      apkUrl,
      appMsg,
      timeToShow,
      status: "active",
    });

    res.status(201).json({
      success: true,
      message: "New app version created successfully.",
      data: version,
    });
  } catch (error) {
    console.error("Error creating app version:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc Get all App Versions (sorted by createdAt DESC)
 * @route GET /api/version/all
 */
export const showAllAppVersions = async (req, res) => {
  try {
    const versions = await AppVersion.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: versions.length,
      data: versions,
    });
  } catch (error) {
    console.error("Error fetching app versions:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc Delete App Version by ID
 * @route DELETE /api/version/:id
 */
export const deleteAppVersion = async (req, res) => {
  try {
    const { id } = req.body;

    const version = await AppVersion.findById(id);
    if (!version) {
      return res.status(404).json({
        success: false,
        message: "App version not found.",
      });
    }

    await AppVersion.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `App version ${version.appVersion} deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting app version:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};