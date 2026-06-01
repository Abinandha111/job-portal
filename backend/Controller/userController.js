export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, company, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        company,
        phone
      },
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};