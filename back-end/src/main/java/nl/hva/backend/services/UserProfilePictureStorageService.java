package nl.hva.backend.services;

import nl.hva.backend.domain.exceptions.PreConditionFailed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Paths;
import java.util.Objects;


/**
 * A service to handle the storage of profile pictures. This service stores all profile pictures in a folder
 * "profile-pictures" in root of this project, if the folder does not exist a new one will made.
 *
 * @author Hamza el Haouti
 */
@Service
public class UserProfilePictureStorageService {

  private static final String PROFILE_PICTURE_DIRECTORY = "profile-pictures";
  private final static String FILE_TYPE_SUFFIX = ".png";

  private final Logger logger = LoggerFactory.getLogger(getClass());

  /**
   * Creates UserProfilePictureStorageService, and creates a folder for the storage of profile pictures, if it
   * does not exist.
   */
  public UserProfilePictureStorageService() {
    try {
      File profilePicDir = Paths.get(PROFILE_PICTURE_DIRECTORY).toFile();
      if (!profilePicDir.exists())
        if (!profilePicDir.mkdir()) {
          logger.debug("Creation of directory for profile pictures failed");
          throw new IllegalStateException("Creation of directory for profile pictures failed");
        }

    } catch (SecurityException e) {
      logger.debug("Creation of directory for profile pictures failed");
      throw new IllegalStateException("Creation of directory for profile pictures failed");
    }
  }

  /**
   * Returns a file object, with the path, of the profile picture of the user with the provided user id.
   */
  public File getBy(String id) {
    return Paths.get(PROFILE_PICTURE_DIRECTORY + File.separator + id + FILE_TYPE_SUFFIX).toFile();
  }

  /**
   * Save or updates the profile picture. If the profile picture is in png format, and the file storage is writable.
   *
   * @param profilePicture The to be stored profile picture.
   * @param userId         The id of the user.
   * @return Whether the proces has succeeded.
   */
  public boolean save(MultipartFile profilePicture, String userId) {
    File saveLocation = Paths
      .get(PROFILE_PICTURE_DIRECTORY + File.separator + userId + FILE_TYPE_SUFFIX)
      .toFile()
      .getAbsoluteFile();

    if (!Objects.equals(profilePicture.getContentType(), "image/png"))
      throw new PreConditionFailed("The provided file is not in png format.");

    try {
      profilePicture.transferTo(saveLocation);
    } catch (Exception e) {
      logger.error("Profile picture could not be saved", e);
      return false;
    }

    return true;
  }

  /**
   * Deletes the profile picture of the user with the provided user id.
   *
   * @return Whether the profile picture could be deleted.
   */
  public boolean deleteBy(String id) {
    File profilePic = Paths.get(PROFILE_PICTURE_DIRECTORY + File.separator + id + FILE_TYPE_SUFFIX).toFile();

    try {
      return profilePic.delete();
    } catch (Exception e) {
      logger.error("Profile picture could not be deleted", e);
      return false;
    }
  }

}